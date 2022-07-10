import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LogginingService {
    lastlog: string;

    pringLog(message: string) {
        this.lastlog = message;
    }
}
