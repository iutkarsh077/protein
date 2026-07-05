import ImageModel from "../models/image_model.js";

const SaveAnalysis = async (req, res) =>{
    try {
        const data = req.body;

        console.log(req.body);

        const saveToDb = await ImageModel.create(req.body)

        return res.json({message: "Data saved successfully", status: true});
    } catch (error) {
        console.log(error);
        return res.json({ message: "Failed to save analysed data", status: false })
    }
}

export default SaveAnalysis;