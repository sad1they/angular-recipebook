import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesAddedComponent } from "./recipes-edit/recipes-edit.component";
import { RecipesResolverService } from "./recipes-resolver.service";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
    {path: '', component: RecipesComponent, canActivate: [AuthGuard], children: [
        {path: '', component: RecipeStartComponent},
        {path: 'new', component: RecipesAddedComponent},
        {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},
        {path: ':id/edit', component: RecipesAddedComponent, resolve: [RecipesResolverService]}
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {

}
