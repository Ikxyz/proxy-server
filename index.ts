import axios, { AxiosResponse } from 'axios';
import cors from 'cors';
import express, { json, text } from 'express';
import morgan from 'morgan';

const { version } = require("./package.json");


const app = express();

app.use(cors());
app.use(text())
app.use(json())
app.use(morgan("dev"))


app.get("/", (req, res) => {
     // const net = os.networkInterfaces();
     // console.log(net)
     // res.send(net);
     res.status(200).send(`Proxy Live v${version}`)
})



app.all("/go", async (req, res) => {
     const { url, body, headers, method = "GET" } = req.body;

     const result = await axios({
          method: method,
          url, data: body, headers: headers, timeout: 25 * 1000
     }).catch((err: any) => {
          if (err.response) {
               const { status, data } = err.response;
               return res.status(status).send(data);
          }
          return res.status(500).send({ message: "server error occurred", data: null, status: false });

     });

     if (!result) {
          return;
     }
     const { data, headers: resHeaders, status }: AxiosResponse = result as any;

     for (let key in resHeaders) {
          res.setHeader(key, resHeaders[key]);
     }

     return res.status(status).send(data);
});

const PORT = Number(process.env.PORT || '') || 8080;

const server = app.listen(PORT, () => {
     console.log(`Server Running on http://localhost:${PORT}`);
});

// process.on("SIGKILL", () => {
//      console.log("Shutting down server");
//      server.close();
// })