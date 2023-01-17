import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration ({
    apiKey : process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express ();
app.use(cors()); 
app.use(express.json()); //allows to pass json from the frontend to backend

app.get('/', async (req,res) => {         
    res.status(200).send({
        message: 'hello from codex',
    })
});

app.post('/',async(req,res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0,  // reduce the risks
            max_tokens:3000,  //could give long responses
            top_p:1,
            frequency_penalty:0.5,  //less likely to generate similar responses
            presence_penalty:0,


        })
      res.status(200).send({          //send the response back to the frontend
        bot : response.data.choices[0].text
      })
    } catch (error){
        console.log(error);
        res.status(500).send({error});
 
    }
})


app.listen(5000, () => console.log('server is running on port http://localhost:5000'));