require('dotenv').config();
const express = require('express')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const jwt = require('jsonwebtoken')
const cors = require('cors');

const port = process.env.PORT || 5000;


// middlewares
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rarr4yf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const apartmentsCollection = client.db("buildingManagement").collection("apartments")

        const agreementsCollection = client.db("buildingManagement").collection("agreements")

        const paymentsCollection = client.db("buildingManagement").collection("payments")

        const usersCollection = client.db("buildingManagement").collection("users")
        const announceCollection = client.db("buildingManagement").collection("announce")

        const couponCollection = client.db("buildingManagement").collection("coupon")


        // payment related api

        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);
            console.log(amount, 'amount inside the intent')

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });

            res.send({
                clientSecret: paymentIntent.client_secret
            })
        });


        // verifyToken Related code 
        const verifyToken = (req, res, next) => {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: 'forbidden access' })
            }

            const token = req.headers.authorization.split(' ')[1];

            jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ message: 'forbidden access' })
                }
                req.decoded = decoded;
                next();
            })
        }


        //   verifyAdmin related code 

        const verifYAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            const isAdmin = user?.role == 'admin';
            if (!isAdmin) {
                res.status(401).send({ message: 'forbidden access' })
            }
            next();
        }



        // jwt related apis
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })


        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const query = { email: email }
            const options = { upsert: true }
            const isExist = await usersCollection.findOne(query)
            console.log('User found?----->', isExist)
            if (isExist) return res.send(isExist)
            const result = await usersCollection.updateOne(
                query,
                {
                    $set: { ...user, timestamp: Date.now() },
                },
                options
            )
            res.send(result)
        })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const result = await usersCollection.findOne({ email })

            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()

            res.send(result)
        })



        // agreements related api
        app.post('/agreements', async (req, res) => {
            const agreementsItem = req.body;
            const result = await agreementsCollection.insertOne(agreementsItem)
            res.send(result)
        })

        app.get('/agreements', async (req, res) => {
            const result = await agreementsCollection.find().toArray()
            res.send(result)
        })


        app.put('/agreements/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const agreementUpdateData = req.body;
            const updateAgreement = {
                $set: {
                    status: agreementUpdateData.status,
                    request: agreementUpdateData.request,
                }
            }
            const result = await agreementsCollection.updateOne(filter, updateAgreement, options)
            res.send(result);
        })


        app.patch('/users/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const filter = { email: email };
        
                const usersUpdateData = req.body;
                const updateUsers = {
                    $set: {
                        role: usersUpdateData.role,
                    },
                };
        
                const result = await usersCollection.updateOne(filter, updateUsers);
        
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Error' });
            }
        });
        


        // this patch using members management
        app.patch('/users/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
        
                const usersUpdateData = req.body;
                const updateUsers = {
                    $set: {
                        role: usersUpdateData.role,
                    },
                };
        
                const result = await usersCollection.updateOne(filter, updateUsers);
        
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: ' Error' });
            }
        });
        



        // payment related api
        app.post('/payments', async (req, res) => {
            const paymentsItem = req.body;
            const result = await paymentsCollection.insertOne(paymentsItem)
            res.send(result)
        })


        app.get('/payments', async (req, res) => {
            const result = await paymentsCollection.find().toArray()
            res.send(result)
        })

        // announce related api

        app.post('/announce', async (req, res) => {
            const announceData = req.body;
            const result = await announceCollection.insertOne(announceData)
            res.send(result)
        })

        app.get('/announce', async (req, res) => {
            const result = await announceCollection.find().toArray();
            res.send(result)
        })

        // coupon collection related api
        app.post('/coupon', async (req, res) => {
            const couponData = req.body;
            const result = await couponCollection.insertOne(couponData)
            res.send(result)
        })


        app.get('/coupon', async (req, res) => {
            const result = await couponCollection.find().toArray();
            res.send(result)
        })

        app.get('/coupon/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await couponCollection.findOne(query)
            res.send(result)
        })

        app.put('/coupon/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const couponUpdateData = req.body;
            const updateCoupon = {
                $set: {
                    code: couponUpdateData.code,
                    discount: couponUpdateData.discount,
                    description: couponUpdateData.description,
                }
            }
            const result = await couponCollection.updateOne(filter, updateCoupon, options)
            res.send(result);
        })


        // pagination related api

        app.get('/apartment', async (req, res) => {
            console.log(req.query)
            const page = Number(req.query.page);
            const limit = Number(req.query.size);

            console.log('page is:', page, 'size is:', limit);

            const result = await apartmentsCollection.find().skip(page * limit).limit(limit).toArray();
            res.send(result)
        })


        app.get('/apartmentsCount', async (req, res) => {
            const count = await apartmentsCollection.estimatedDocumentCount()
            res.send({ count })
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Building Management korbo...........')
})

app.listen(port, () => {
    console.log(`Building Management is running ${port}`)
})