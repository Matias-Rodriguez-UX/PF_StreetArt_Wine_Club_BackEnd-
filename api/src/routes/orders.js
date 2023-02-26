const express = require("express");
const router = express.Router();
const { Product, Order, ShoppingCart, User, Address } = require("../db.js");
const { getOrderId } = require("../controllers/getOrderId");
const { changeOrder } = require("../controllers/changeOrder");
const { localStorageCart } = require("../controllers/localStorageCart");
const { updateOrderById } = require("../controllers/updateOrder.js");
// ruta que retorna todas las ordenes(solo dar acceso Admin)

router.get("/", async (req, res) => {
  try {
    //console.log("soy el console");
    let allOrders = await Order.findAll({
      include: { model: User, as: "user" },
    });
    res.status(200).send(allOrders);
  } catch (error) {
    res.status(400).send("no purchase orders created");
  }
});
//get order del user
router.get("/byuser", async (req, res) => {
  //console.log("SOY LA RUTA")
  try {
    const { email } = req.query;

    let result = await Order.findAll({
      where: {
        userEmail: email,
      },
      include: { model: Product },
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// retornar orden por id
router.get("/:id", async (req, res) => {
  try {
    //console.log("SOY LA RUTA");
    const { id } = req.params;
    let result = await getOrderId(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// crear ruta para modificar una Orden

router.put("/checkout/", async (req, res) => {
  try {
    const orderId = req.query.orderId || null;
    const addressId = req.query.addressId || null;
    //console.log(orderId, "y", addressId, "EN RUTA");
    const {
      status,
      email,
      reference,
      Newaddress,
      zipCode,
      telephone,
      state,
      region,
    } = req.body;
    // console.log(req.body)
    if (
      email &&
      reference &&
      Newaddress &&
      zipCode &&
      telephone &&
      state &&
      region
    ) {
      var newAddress = await Address.create({
        reference: reference,
        address: Newaddress,
        zipCode: zipCode,
        telephone: telephone,
        userEmail: email,
        state: state,
        region: region,
      });

      let result = await changeOrder(
        status,
        email,
        orderId,
        addressId,
        newAddress
      );
      res.status(200).send(result);
    } else {
      let result = await changeOrder(status, email, orderId, addressId);
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/backToCart/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    let result = await Order.update(
      {
        status: "cart",
      },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/localStorageCart", async (req, res) => {
  try {
    const { arrayProducts, email } = req.body;
    let result = await localStorageCart(arrayProducts, email);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/update", async (req, res) => {
  try {

    const orderId = req.query.orderId || null;
    const addressId = req.query.addressId || null;
    const { status } = req.body;

    let result = await updateOrderById(orderId, status, addressId)
    console.log(result)
    res.status(200).send(result);
  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message);
  }
});







module.exports = router;
