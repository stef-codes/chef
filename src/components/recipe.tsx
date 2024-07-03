"use client"

import React, { useState } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Define the type for a recipe
type Recipe = {
  name: string;
  ingredients: string[];
  instructions: string[];
};

export function Recipe() {
  // Use the Recipe type with useState
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]); // State for photo URLs

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos];
        newPhotos[index] = reader.result as string;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (index: number) => {
    const fileInput = document.getElementById(`file-input-${index}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleRecipeSave = (recipe: Recipe) => {
    setSavedRecipes([...savedRecipes, recipe]);
  };

  const handleSubmit = () => {
    // Implement your submit logic here
    console.log("Submitting recipes...");
    // Example: You can call an API or perform any other action here
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 md:px-6">
      <header className="flex justify-between items-center mb-8">
        <nav className="flex gap-4">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Generate
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Cookbook
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Meal Plans
          </Link>
        </nav>
      </header>
      <div className="grid gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">Upload Photos</h2>
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photoSrc, index) => (
              <div key={index} className="bg-muted rounded-md overflow-hidden aspect-square relative">
                <div
                  onClick={() => handleImageClick(index)}
                  className="w-full h-full cursor-pointer"
                >
                  {photoSrc ? (
                    <img
                      src={photoSrc}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full border-dashed border-2 border-gray-300 flex justify-center items-center">
                      <p className="text-gray-400">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input
                  id={`file-input-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event, index)}
                  className="hidden"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Dietary Restrictions</h2>
          <Textarea
            placeholder="Enter your dietary restrictions (e.g., vegan, gluten-free, nut allergy)"
            className="w-full"
            rows={3}
          />
        </div>
        <div>
          <Button className="w-full" onClick={handleSubmit}>Generate Recipes</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {savedRecipes.map((recipe, index) => (
            <Card key={index}>
              <CardContent>
                {/* Replace with actual uploaded photo */}
                <div className="bg-gray-200 h-48 w-full flex items-center justify-center">
                  <p className="text-gray-400">Placeholder for Recipe Photo</p>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                  <p className="text-muted-foreground">
                    {/* Add ingredients and instructions display */}
                    Ingredients: {recipe.ingredients.join(", ")} <br />
                    Instructions: {recipe.instructions.join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};




