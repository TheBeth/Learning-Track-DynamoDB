const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const PET_TABLE = "..."; //Change this by table name

exports.getAllPet = async (req, res) => {
  try {
    const query = { TableName: PET_TABLE };
    const pets = await dynamoClient.scan(query).promise();
    res.status(200).json(pets);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getPetById = async (req, res) => {
  try {
    const { petId } = req.params;
    const query = { TableName: PET_TABLE, Key: { id: petId } };
    const pet = await dynamoClient.get(query).promise();
    if (!pet.Item) {
      return res.status(400).json({ message: "ID not Found" });
    }
    res.status(200).json(pet);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createPet = async (req, res) => {
  try {
    const pet = req.body;
    if (!req.body.petName) {
      return res.status(400).json({ message: "petName require" });
    }
    if (!req.body.petType) {
      return res.status(400).json({ message: "petType require" });
    }
    const params = { TableName: PET_TABLE };
    const existingPet = await dynamoClient.scan(params).promise();

    const idInUse = [];
    existingPet.Items.filter((item) => {
      idInUse.push(item.id);
    });
    let newId = Math.max(...idInUse) + 1;
    if (newId < 1) {
      newId = 1;
    }

    const havePet = existingPet.Items.filter((item) => {
      return (
        item.petName.toUpperCase() === req.body.petName.toUpperCase() &&
        item.petType.toUpperCase() === req.body.petType.toUpperCase()
      );
    });

    if (havePet[0]) {
      return res
        .status(400)
        .json({ message: "petName and petType already in use" });
    }
    req.body.id = newId.toString();
    const query = { TableName: PET_TABLE, Item: pet };
    const newPet = await dynamoClient.put(query).promise();
    res.status(200).json(newPet);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.editPet = async (req, res) => {
  try {
    const { petId } = req.params;

    const params = { TableName: PET_TABLE, Key: { id: petId } };
    const isPet = await dynamoClient.get(params).promise();
    const allPet = await dynamoClient.scan(params).promise();
    if (!isPet.Item) {
      return res.status(400).json({ message: "ID not Found" });
    }

    const pet = req.body;
    if (req.body.petName) {
      return res.status(400).json({ message: "Can not change pet name" });
    }
    if (!req.body.petType) {
      return res.status(400).json({ message: "petType require" });
    }

    const isDuplicatePet = allPet.Items.filter((item) => {
      return (
        item.petName.toUpperCase() === isPet.Item.petName.toUpperCase() &&
        item.petType.toUpperCase() === req.body.petType.toUpperCase()
      );
    });
    if (isDuplicatePet[0]) {
      return res.status(400).json({ message: "This petType already in use." });
    }

    pet.petName = isPet.Item.petName;
    pet.id = petId;
    const query = {
      TableName: PET_TABLE,
      Item: pet,
    };
    const newPet = await dynamoClient.put(query).promise();
    res.status(200).json(newPet);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deletePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const query = {
      TableName: PET_TABLE,
      Key: { id: petId },
    };
    const isPet = await dynamoClient.get(query).promise();
    if (!isPet.Item) {
      return res.status(400).json({ message: "ID not found" });
    }

    await dynamoClient.delete(query).promise();
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};
