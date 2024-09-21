import ReportList from "../model/report";
import ReturnList from "../model/returnExchange";


const report = [
    {
        "title": "Item Not Received",
        "description": "You can report if you haven't received your order within the expected delivery window."
    },
    {
        "title": "Item Not as Described",
        "description": "Report if the received item doesn't match the product description."
    },
    {
        "title": "Problem with Order",
        "description": "Report issues like incorrect or missing items, damaged products, etc."
    },
    {
        "title": "Account or Payment Issues",
        "description": "Report problems related to your Amazon account or payment methods."
    },
    {
        "title": "Safety Concerns",
        "description": "Report if you believe a product poses a safety risk."
    },
    {
        "title": "Billing Issue",
        "description": "Report issues related to your billing or charges."
    },
    {
        "title": "Unauthorized Purchase",
        "description": "Report if there are unauthorized charges or purchases on your account."
    },
    {
        "title": "Late Delivery",
        "description": "Report if the delivery of your order is significantly delayed."
    },
    {
        "title": "Return or Refund Issues",
        "description": "Report if you're experiencing problems with returns or refunds."
    },
    {
        "title": "Gift Card or Promotional Code Issue",
        "description": "Report issues related to gift cards or promotional codes."
    },
    {
        "title": "Review or Feedback Issue",
        "description": "Report issues with reviews or feedback you've left on products or sellers."
    },
    {
        "title": "Other Issues",
        "description": "Report any other concerns or issues not covered by the above categories."
    }
]

const returnExchange = [
    {
        "title": "Defective/Damaged",
        "description": "The product arrived with defects in the material, is broken, or has parts that are not working correctly."
    },
    {
        "title": "Wrong Item Received",
        "description": "The customer received an entirely different item than what was ordered."
    },
    {
        "title": "Incorrect Size/Color/Style",
        "description": "The ordered item doesn't fit, is the wrong color, or isn't the correct style."
    },
    {
        "title": "Changed Mind",
        "description": "The customer decided they do not want the item after all."
    },
    {
        "title": "No Longer Needed",
        "description": "The customer's original need for the item has changed."
    },
    {
        "title": "Not as Described/Expected",
        "description": "The item doesn't match the website description or photos, leading to unmet expectations."
    },
    {
        "title": "Late Delivery",
        "description": "The item arrived significantly after the promised delivery date or after the customer needed it."
    },
    {
        "title": "Arrived Too Early",
        "description": "In some cases, the item may have arrived too early for the customer's intended use."
    },
    {
        "title": "Buyer's Remorse",
        "description": "The customer regrets the purchase immediately after placing the order."
    },
    {
        "title": "Duplicate Order",
        "description": "The customer accidentally ordered the item multiple times."
    }
]



async function reportSeeder() {
    const reportListSeed = await ReportList.estimatedDocumentCount();

    if (!reportListSeed) {
        await ReportList.create(report);
        console.log("Report list seeded");
    }
}

async function returnExchangeSeeder() {
    const returnListSeed = await ReturnList.estimatedDocumentCount();

    if (!returnListSeed) {
        await ReturnList.create(returnExchange);
        console.log("Return list seeded");
    }
}


reportSeeder()
returnExchangeSeeder()