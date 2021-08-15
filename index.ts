import express, { json, text } from "express";
import axios, { AxiosError, AxiosResponse } from "axios";
import cors from "cors";
import morgan from "morgan";


const app = express();

app.use(cors());
app.use(text())
app.use(json())
app.use(morgan("dev"))


app.get("/", (req, res) => {
     res.status(200).send("Server Online")
})




app.get("/:url", async (req, res) => {
     const { url } = req.query as any;

     const result = await axios.get(url, { headers: req.headers }).catch((err: any) => {
          if (err.response) {
               const { response: { data, headers, status } } = err.response;
               return res.status(status).send(data);
          }
     });

     if (!result) {
          return;
     }
     const { data, headers: resHeaders, status }: AxiosResponse = result as any;

     for (let key in resHeaders) {
          res.setHeader(key, resHeaders[key]);
     }

     return res.status(status).send(data);

})

app.post("/", async (req, res) => {
     const { url, body, headers } = req.body;

     const result = await axios.post(url, body, { headers: headers }).catch((err: any) => {
          if (err.response) {
               const { status, data } = err.response;
               return res.status(status).send(data);
          }
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