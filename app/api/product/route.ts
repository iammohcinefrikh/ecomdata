import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Product from "@/lib/models/productModel";
import dbConnect from "@/lib/dbConnect";

interface ProductUser {
  userEmail: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Vous devez être connecté pour effectuer cette action"
      }, { status: 401 });
    }

    const { productUrl, productWebsite } = await request.json();
    const scraper = await import(`@/lib/scrappers/${productWebsite}Scrapper`);
    const productDetails = await scraper[`${productWebsite}Scrapper`](productUrl);

    if (!productDetails.productName || !productDetails.productPrice) {
      return NextResponse.json({
        statusCode: 400,
        error: "Bad Request",
        message: "L'opération de mise au rebut des détails du produit a échoué"
      }, { status: 400 });
    }

    const productPriceNumber = parseFloat(productDetails.productPrice.replace(/[^\d.-]/g, ""));

    await dbConnect();

    const existingProduct = await Product.findOne({ productName: productDetails.productName });

    if (existingProduct) {
      const importedProduct = existingProduct.productUsers.some((user: ProductUser) => user.userEmail === session?.user?.email);

      if (importedProduct) {
        return NextResponse.json({
          statusCode: 409,
          success: "Conflict",
          message: "Produit déjà importé"
        }, { status: 409 });
      }
      
      else {
        const productData = {
          productName: productDetails.productName,
          productPrice: productPriceNumber,
          productUrl: productUrl,
          productWebsite: productWebsite,
          productPriceHistory: [
            {
              productPrice: productPriceNumber,
              priceLogDate: new Date()
            }
          ]
        };
      
        const updateResult = await Product.updateOne(
          { _id: existingProduct._id },
          {
            $set: productData,
            $push: {
              productUsers: {
                userEmail: session?.user?.email
              }
            }
          }
        );
      
        const modifiedCount = (updateResult as any).nModified;

        return NextResponse.json({
          statusCode: 200,
          success: "OK",
          message: "Produit importé avec succès",
          product: modifiedCount > 0 ? updateResult : null
        }, { status: 200 });
      }
    }

    else {
      const newProduct = new Product({
        productName: productDetails.productName,
        productPrice: productPriceNumber,
        productUrl: productUrl,
        productWebsite: productWebsite,
        productPriceHistory: [
          {
            productPrice: productPriceNumber,
            priceLogDate: new Date()
          }
        ],
        productUsers: [
          {
            userEmail: session?.user?.email,
            userImportDate: new Date()
          }
        ]
      });

      const savedProduct = await newProduct.save();

      return NextResponse.json({
        statusCode: 201,
        success: "Created",
        message: "Produit importé avec succès",
        product: savedProduct
      }, { status: 201 });
    }
  } 
  
  catch (error) {
    return NextResponse.json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Erreur lors de l'importation du produit"
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Vous devez être connecté pour effectuer cette action"
      }, { status: 401 });
    }

    await dbConnect();

    const products = await Product.aggregate([
      {
        $match: { "productUsers.userEmail": session?.user?.email }
      },
      {
        $addFields: {
          productUsers: {
            $filter: {
              input: "$productUsers",
              cond: { $eq: ["$$this.userEmail", session?.user?.email] }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          productPrice: 1,
          productUrl: 1,
          productWebsite: 1,
          productPriceHistory: 1,
          productUsers: 1
        }
      }
    ]);    

    return NextResponse.json({
      statusCode: 200,
      success: "OK",
      message: "Oroduits recherchés avec succès",
      products: products
    }, { status: 200 });
  }

  catch (error) {
    return NextResponse.json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Erreur lors de la recherche de produits"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Vous devez être connecté pour effectuer cette action"
      }, { status: 401 });
    }

    const { productId } = await request.json();
    const userEmail = session?.user?.email;

    if (!productId) {
      return NextResponse.json({
        statusCode: 400,
        error: "Bad Request",
        message: "Product ID is required"
      }, { status: 400 });
    }

    await dbConnect();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({
        statusCode: 404,
        error: "Not Found",
        message: "Produit non trouvé"
      }, { status: 404 });
    }

    const userIndex = product.productUsers.findIndex((user: ProductUser) => user.userEmail === userEmail);

    if (userIndex === -1) {
      return NextResponse.json({
        statusCode: 403,
        error: "Forbidden",
        message: "Vous n'êtes pas autorisé à supprimer ce produit"
      }, { status: 403 });
    }

    if (product.productUsers.length === 1 && product.productUsers[0].userEmail === userEmail) {
      await Product.deleteOne({ _id: productId });

      return NextResponse.json({
        statusCode: 200,
        success: "OK",
        message: "Produit supprimé avec succès"
      }, { status: 200 });
    } 
    
    else {
      product.productUsers.splice(userIndex, 1);
      await product.save();

      return NextResponse.json({
        statusCode: 200,
        success: "OK",
        message: "Utilisateur supprimé du produit avec succès"
      }, { status: 200 });
    }
  } 
  
  catch (error) {
    return NextResponse.json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Erreur lors de la suppression du produit"
    }, { status: 500 });
  }
}