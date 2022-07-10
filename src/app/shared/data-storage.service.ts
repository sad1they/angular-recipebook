import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipes.model";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    dataBaseUrl = 'https://recipe-angular-bc270-default-rtdb.firebaseio.com/';
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        return this.http.put(this.dataBaseUrl + 'recipes.json', recipes).subscribe((res) => {
            console.log(res);
        });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(this.dataBaseUrl + 'recipes.json')
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {...recipe, imgredients: recipe.ingredients ? recipe.ingredients : []}
                    });
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes)
                })
            );
    }
}
