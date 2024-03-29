import slugify from "slugify"
import productModel from "../models/productModel.js"
import fs from 'fs'
import router from "../routes/authRout.js"

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' })
            case !description:
                return res.status(500).send({ error: 'Description is Required' })
            case !price:
                return res.status(500).send({ error: 'Price is Required' })
            case !category:
                return res.status(500).send({ error: 'Catrgory is Required' })
            case !quantity:
                return res.status(500).send({ error: 'Quantity is Required' })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is Required less then 1MB' })
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contectType = photo.type
        }

        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product created Successfully',
            products,
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating Product'
        })
    }
}

//get all product

export const getProductController = async (req, res) => {
    try {
        const product = await productModel.find({}).select("-photo").populate('category').limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            countTotal: product.length,
            message: 'All product',
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting product",
            error: error.message
        })
    }
}

// get single product

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select('-photo').populate('category')
        res.status(200).send({
            success: true,
            message: 'Single product Fetch',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting single product',
            error

        })
    }
}

// get product photo

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('photo')
        if (product.photo.data) {
            res.set('Content-type', product.photo.contectType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting photo',
            error
        })
    }
}

// delete product

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo')
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while deleting product',
            error
        })
    }
}

//update product 

export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' })
            case !description:
                return res.status(500).send({ error: 'Description is Required' })
            case !price:
                return res.status(500).send({ error: 'Price is Required' })
            case !category:
                return res.status(500).send({ error: 'Catrgory is Required' })
            case !quantity:
                return res.status(500).send({ error: 'Quantity is Required' })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is Required less then 1MB' })
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields, slug:slugify(name)}, {new:true}
            )
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contectType = photo.type
        }

        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product updated Successfully',
            products,
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in update Product'
        })
    }
}