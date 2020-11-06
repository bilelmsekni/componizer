import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-custom",
  templateUrl: "./custom.component.html",
  styleUrls: ["./custom.component.scss"],
})
export class CustomComponent implements OnInit {
  constructor() {}

  @Input()
  value: any;

  @Input()
  input2: any;

  ngOnInit(): void {}
}
