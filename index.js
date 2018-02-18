const express = require('express');
const stripe = require('stripe')('sk_test_7s2NOA1kXwB7LoXjnxPkDK9i');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express()

//console.log('wassup pranav');

//bodyParser congigs
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


//handlebars configs

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//folder configs
app.use(express.static(`${__dirname}/public`))


const planBlue = stripe.plans.create({
  product: {
    name: "Blue_Belt"
  },
  currency: 'usd',
  interval: 'month',
  nickname: 'Chat bot Monthly',
  amount: 2500,
},function(err, planBlue) {
  // asynchronously called
  console.log(planBlue);

  var planBlueId = planBlue.id
  console.log("planBlueId -"+planBlueId);
  return planBlueId
})



// const customer = stripe.customers.create({
//   email: 'abc@test.com',
// });

app.get('/',(req,res)=>{
  console.log(res.body);
  res.render('index')
//  console.log(req.body);
})

app.post('/charge',(req,res)=>{
  const amount = 2500;
//  console.log(req.body);
//  var customerID = customer.id

  debugger
  stripe.customers.create({
    email:req.body.stripeEmail,
    source:req.body.stripeToken
  })
  .then(customer =>stripe.charges.create({
    amount,
    currency:'usd',
    plan: planBlue.id,
    customer:customer.id

  }))
  .then(charge => res.render('success'))


  const subscription = stripe.subscriptions.create({
  customer:'abc@test.com',
  items: [{plan: planBlue.id}],
  });
})



const port = process.env.PORT || 3000

app.listen(port,()=>{

  console.log(`server listening on ${port}`);
})
