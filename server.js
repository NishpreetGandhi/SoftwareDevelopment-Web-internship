const express = require('express');
const axios = require('axios');
const gql = require('graphql-tag');
const cors = require('cors');
const path = require('path'); 

const app = express();
const port = 3000;


const client = axios.create({
  baseURL: 'http://localhost:8080/v1/graphql',  
  headers: {
    'x-hasura-admin-secret': 'Nishpreet',  
    'Content-Type': 'application/json'
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join('C:/Users/91955/fintech-platform/public')));  

app.post('/deposit', async (req, res) => {
  const { account_id, amount } = req.body;
  const mutation = gql`
    mutation Deposit($account_id: Int!, $amount: numeric!) {
      update_accounts(
        where: { id: { _eq: $account_id } }
        _inc: { balance: $amount }
      ) {
        affected_rows
      }
      insert_transactions(objects: { account_id: $account_id, amount: $amount, type: "deposit" }) {
        affected_rows
      }
    }
  `;
  try {
    await client.post('', { query: mutation.loc.source.body, variables: { account_id, amount } });
    res.status(200).send('Deposit successful');
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

app.post('/withdraw', async (req, res) => {
  const { account_id, amount } = req.body;
  const mutation = gql`
    mutation Withdraw($account_id: Int!, $amount: numeric!) {
      update_accounts(
        where: { id: { _eq: $account_id } }
        _inc: { balance: -$amount }
      ) {
        affected_rows
      }
      insert_transactions(objects: { account_id: $account_id, amount: $amount, type: "withdrawal" }) {
        affected_rows
      }
    }
  `;
  try {
    await client.post('', { query: mutation.loc.source.body, variables: { account_id, amount } });
    res.status(200).send('Withdrawal successful');
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
