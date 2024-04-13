const cloudinary = require("../cloud/cloudinary.js");
const User = require("../models/users.js");
const { crops, qualitytype } = require("../models/crops.js");
const { Transaction, TransactionContent } = require("../models/transaction.js");
const {
  FarmerInfo,
  TraderInfo,
  purchasingdetail,
} = require("../models/userInfo.js");

const { Op } = require("sequelize");

exports.sendTransactionOffer = async (req, res, next) => {
  try {
    const FarmerUserID = req.userId;
    const TraderUserID = req.body.traderUserID;
    const crops = req.body.crops;

    //Check if TransactionOfferExists
    const transactionOfferExists = await Transaction.findOne({
      where: {
        FarmerUserID,
        TraderUserID,
        Status: "Pending" || "Ongoing",
      },
    });

    if (transactionOfferExists) {
      return res
        .status(401)
        .json({ message: "Transaction offer already exists" });
    }

    // Calculate total number of unique crops and total price
    const uniqueCrops = new Set();
    let Total = 0;
    crops.forEach((crop) => {
      uniqueCrops.add(crop.selectedCrop.CropID); // Assuming CropID is unique for each crop
      Total += crop.Quantity * crop.PricePerUnit;
    });
    const TotalNumOfCrops = uniqueCrops.size; // Count the number of unique crops

    // Create a transaction in the Transaction table
    const transaction = await Transaction.create({
      FarmerUserID,
      TraderUserID,
      TotalNumOfCrops,
      Total,
      TimeStamp: new Date().toISOString(),
      Status: "Pending",
    });

    // Save each crop as transaction content
    for (const crop of crops) {
      await TransactionContent.create({
        TransactionID: transaction.TransactionID,
        CropID: crop.selectedCrop.CropID,
        PricePerUnit: crop.PricePerUnit,
        CropType: crop.CropType,
        QualityTypeID: crop.QualityTypeID,
        Quantity: crop.Quantity,
        Total: crop.Quantity * crop.PricePerUnit,
      });
    }

    res.status(200).json({ message: "Transaction offer sent" });
  } catch (error) {
    console.error("Error sending transaction offer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const userID = req.userId;
    const userType = req.query.UserType;
    const Query = req.query.query;

    let transactions;

    if (userType === "Farmer") {
      // Fetch all transactions for FarmerUserID
      transactions = await Transaction.findAll({
        where: {
          FarmerUserID: userID,
        },
        include: [
          {
            model: TransactionContent,
            as: "transactioncontent",
          },
        ],
      });
    } else if (userType === "Trader") {
      // Fetch all transactions for TraderUserID
      transactions = await Transaction.findAll({
        where: {
          TraderUserID: userID,
        },
        include: [
          {
            model: TransactionContent,
            as: "transactioncontent",
          },
        ],
      });
    } else {
      return res.status(400).json({ message: "Invalid userType" });
    }

    // Group transactions by unique combination of FarmerUserID and TraderUserID
    const groupedTransactions = {};
    transactions.forEach((transaction) => {
      const key = `${transaction.FarmerUserID}-${transaction.TraderUserID}`;
      if (!groupedTransactions[key]) {
        groupedTransactions[key] = {
          transactions: [],
        };
      }
      groupedTransactions[key].transactions.push(transaction);
    });

    console.log("Grouped transactions:", groupedTransactions);

    // Fetch TraderInfo or FarmerInfo for each unique combination
    const uniqueTransactions = Object.values(groupedTransactions);
    const userInfoPromises = uniqueTransactions.map(async (group) => {
      console.log("QUERY ===========", Query);
      const queryOptionsF = Query
        ? {
            where: {
              Fullname: {
                [Op.like]: `%${Query}%`,
              },
            },
          }
        : {
            where: {
              UserID: group.transactions[0].FarmerUserID,
            },
          };
      const queryOptionsT = Query
        ? {
            where: {
              Fullname: {
                [Op.like]: `%${Query}%`,
              },
            },
          }
        : {
            where: {
              UserID: group.transactions[0].TraderUserID,
            },
          };

      const [farmerInfo, traderInfo] = await Promise.all([
        FarmerInfo.findOne({
          where: {
            UserID: group.transactions[0].FarmerUserID,
            ...queryOptionsF.where,
          },
        }),
        TraderInfo.findOne({
          where: {
            UserID: group.transactions[0].TraderUserID,
            ...queryOptionsT.where,
          },
        }),
      ]);
      return userType === "Farmer" ? traderInfo : farmerInfo;
    });
    const userInfos = await Promise.all(userInfoPromises);

    // Attach userInfo to each unique transaction group
    uniqueTransactions.forEach((group, index) => {
      group.userInfo = userInfos[index];
    });

    res.status(200).json({ transactions: uniqueTransactions });
  } catch (error) {
    console.error("Error querying transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.confirmTransaction = async (req, res, next) => {
  try {
    const transactionID = req.body.TransactionID;
    const isConfirmed = req.body.isConfirm;

    await Transaction.update(
      { Status: isConfirmed ? "Ongoing" : "Declined" },
      {
        where: {
          TransactionID: transactionID,
        },
      }
    );

    res.status(200).json({ message: "Transaction Confirmed" });
  } catch (error) {
    console.error("Error sending response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.completeTransaction = async (req, res, next) => {
  try {
    const transactionID = req.body.TransactionID;

    await Transaction.update(
      { Status: "Complete" },
      {
        where: {
          TransactionID: transactionID,
        },
      }
    );

    res.status(200).json({ message: "Transaction Complete" });
  } catch (error) {
    console.error("Error sending response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
