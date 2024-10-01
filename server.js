const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");

// app.use(morgan("dev"));

// middleware untuk membaca json
app.use(express.json());

// Default URL = Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Application is running",
  });
});

// API/v1/(collection) => collection nya harus jamak
app.get("/api/v1/cars", async (req, res) => {
  try {
    const cars = JSON.parse(
      await fs.promises.readFile(`${__dirname}/assets/data/cars.json`, "utf-8")
    );

    res.status(200).json({
      status: "200",
      message: "Success get cars data",
      isSuccess: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
});

const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/assets/data/cars.json`, "utf-8")
);

app.post("/api/v1/cars", (req, res) => {
  const newCar = req.body;

  cars.push(newCar);

  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "201",
        message: "Success add new cars data",
        isSuccess: true,
        data: { car: newCar },
      });
    }
  );

  res.status(200).json({
    status: "200",
    message: "Success add cars data",
    totalData: cars.length,
    isSuccess: true,
    data: { cars },
  });
});

app.get("/rafly", (req, res) => {
  res.status(200).json({
    status: "200",
    message: "Ping successfully",
    name: "rafly",
    age: 18,
    country: "indonesia",
    city: "jakarta",
  });
});

app.use(express.json());

// middleware / handler untuk url yang tidak dapat di akses karena memang tidak ada di aplikasi
// membuat middleware = our own middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "404",
    message: "Api Not Exist",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
