const express = require("express")
require('dotenv').config()
const app= express()


app.get("/",(request, response)=>{
    response.json(data).status(200);
});



app.listen(process.env.PORT,()=>{
    console.log("app is running on port: "+process.env.PORT)
});



// just for reference
const data = {
    "levels": {
      "level1": "Country",
      "level2": "Gender",
      "level3": "Age Group",
      "series" : "year",
      "range-start" : "2019",
      "range-end" : "2023"
    },
    "data": [
      {
        "level1": "country1",
        "male": {
          "20-40": {
            "2019": 10,
            "2020": 8,
            "2021": 15
          },
          "40-60": {
            "2019": 10,
            "2020": 8,
            "2021": 15
          },
          "60-80": {
            "2019": 10,
            "2020": 8,
            "2021": 15
          }
        },
        "female": {
          "20-40": {
            "2019": 19,
            "2020": 8,
            "2021": 15
          },
          "40-60": {
            "2019": 10,
            "2020": 8,
            "2021": 15
          },
          "60-80": {
            "2019": 10,
            "2020": 8,
            "2021": 15
          }
        }
      }
    ]
  }