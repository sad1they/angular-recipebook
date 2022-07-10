import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

    private closeSub: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return null
        }

        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;

        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(res => {
            this.isLoading = false;
            console.log(res);
            this.router.navigate(['/recipes']);
        }, errorMes => {
            this.error = errorMes;
            this.showErrorAlert(errorMes);
            console.log(this.error);
            this.isLoading = false;
        });

        form.reset();
    }

    onHandleError() {
        this.error = null;
    }

    private showErrorAlert(errorMes: string) {
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;

        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

        componentRef.instance.message = errorMes;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(): void {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }
}
