import { Component, OnInit } from '@angular/core';
import { ASTUCES } from '../share/astuce';

@Component({
  selector: 'app-astuce',
  templateUrl: './astuce.component.html',
  styleUrls: ['./astuce.component.scss']
})
export class AstuceComponent implements OnInit {

  astuces = ASTUCES;

  constructor() { }

  ngOnInit(): void {
  }

}
