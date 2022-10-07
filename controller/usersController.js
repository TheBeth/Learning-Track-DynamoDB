const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = process.env.USER_TABLE;
const PET_TABLE = process.env.PET_TABLE;

exports.getAllUser = async (req, res) => {
  try {
    const query = { TableName: USER_TABLE };
    const users = await dynamoClient.scan(query).promise();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { TableName: USER_TABLE, Key: { id } };
    const user = await dynamoClient.get(query).promise();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = req.body;
    if (!user.userName) {
      return res.status(400).json({ message: "userName require" });
    }
    if (!user.firstName) {
      return res.status(400).json({ message: "firstName require" });
    }
    if (!user.lastName) {
      return res.status(400).json({ message: "lastName require" });
    }
    const params = {
      TableName: USER_TABLE,
    };
    const existingUser = await dynamoClient.scan(params).promise();
    const idInUse = [];
    existingUser.Items.filter((item) => {
      idInUse.push(item.id);
      // return item.id == req.body.id;
    });
    const newId = Math.max(...idInUse) + 1;
    // if (haveId) {
    //   return res.status(400).json({ message: "ID already in use" });
    // }

    const haveUser = existingUser.Items.filter((item) => {
      return item.userName.toLowerCase() == req.body.userName.toLowerCase();
    });
    console.log(haveUser);
    if (haveUser[0]) {
      return res.status(400).json({ message: "Username already in use." });
    }

    req.body.id = newId.toString();
    req.body.petName = [];
    const query = {
      TableName: USER_TABLE,
      Item: user,
    };
    const newUser = await dynamoClient.put(query).promise();
    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const params = {
      TableName: USER_TABLE,
      Key: { id },
    };
    const isUser = await dynamoClient.get(params).promise();

    if (!req.body.firstName) {
      req.body.firstName = isUser.Item.firstName;
    }
    if (!req.body.lastName) {
      req.body.lastName = isUser.Item.lastName;
    }
    if (!req.body.age) {
      req.body.age = isUser.Item.age;
    }
    let user = {
      userName: isUser.Item.userName,
      id: id,
      petName: isUser.Item.petName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
    };
    const query = {
      TableName: USER_TABLE,
      Item: user,
    };
    const newUser = await dynamoClient.put(query).promise();
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {
      TableName: USER_TABLE,
      Key: { id },
    };
    await dynamoClient.delete(query).promise();
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addPet = async (req, res) => {
  try {
    const { id } = req.params;

    const paramsUser = { TableName: USER_TABLE, Key: { id } };
    const idUser = await dynamoClient.get(paramsUser).promise();
    if (!idUser.Item) {
      return res.status(400).json({ message: "User ID not found." });
    }

    const paramsPet = { TableName: PET_TABLE, Key: { id: req.body.petId } };
    const isPet = await dynamoClient.get(paramsPet).promise();
    if (!isPet.Item) {
      return res.status(400).json({ message: "Pet ID not found" });
    }
    idUser.Item.petName.push(req.body.petId);
    const query = {
      TableName: USER_TABLE,
      Item: idUser.Item,
    };
    const newUser = await dynamoClient.put(query).promise();
    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const paramsUser = { TableName: USER_TABLE, Key: { id } };
    const isUser = await dynamoClient.get(paramsUser).promise();
    if (!isUser.Item) {
      return res.status(400).json({ message: "User Id not found" });
    }
    const paramsPet = { TableName: PET_TABLE, Key: { id: req.body.petId } };
    const isPet = await dynamoClient.get(paramsPet).promise();
    if (!isPet.Item) {
      return res.status(400).json({ message: "Pet ID not found." });
    }

    if (isUser.Item.petName.length === 1) {
      return res
        .status(400)
        .json({ message: "You must to have pet 1 or more" });
    }

    isUser.Item.petName = isUser.Item.petName.filter((item) => {
      return item != req.body.petId;
    });
    const query = { TableName: USER_TABLE, Item: isUser.Item };
    const newUser = await dynamoClient.put(query).promise();
    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getPetByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const paramsUser = {
      TableName: USER_TABLE,
      Key: { id },
    };
    const havePet = [];
    const user = await dynamoClient.get(paramsUser).promise();
    for (let i = 0; i < user.Item.petName.length; i++) {
      const query = { TableName: PET_TABLE, Key: { id: user.Item.petName[i] } };
      const pet = await dynamoClient.get(query).promise();
      havePet.push(pet.Item);
    }
    res.status(200).json({ Pets: havePet });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.petNotOwn = async (req, res) => {
  try {
    const { id } = req.params;
    const allPetParams = { TableName: PET_TABLE };
    const allPet = await dynamoClient.scan(allPetParams).promise();
    const paramsUser = {
      TableName: USER_TABLE,
      Key: { id },
    };
    const havePet = [];
    const user = await dynamoClient.get(paramsUser).promise();
    for (let i = 0; i < user.Item.petName.length; i++) {
      const query = { TableName: PET_TABLE, Key: { id: user.Item.petName[i] } };
      const pet = await dynamoClient.get(query).promise();
      if (pet.Item !== undefined) {
        havePet.push(pet.Item);
      }
    }
    let petNotOwn = allPet.Items.filter(
      (o1) => !havePet.some((o2) => o1.id === o2.id)
    );

    res.status(200).json({ NotOwn: petNotOwn });
  } catch (err) {
    res.status(400).json(err);
  }
};
