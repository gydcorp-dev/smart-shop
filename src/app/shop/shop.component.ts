import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ApiService],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  categories: any[] = []
  articles: any = []
  loading:Boolean=false
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  articleForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    nom: new FormControl('', [Validators.required]),
    prix: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  descriptedarticleForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    nom: new FormControl('', [Validators.required]),
    prix: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  article: any = {
    nom: "",
    category: {
      nom: ""
    },
    prix: 0,
    description: ""
  }
  constructor(
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.apiService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res
      }, error: (err: any) => {
        console.log(err)
      }
    })
    this.apiService.getArticles().subscribe({
      next: (res: any) => {
        this.articles = res
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }
  date = new Date()

  filter_articles(type: number) {
    return this.articles.filter((article: any) => article.categories.id === type)
  }
  select(art: any) {
    this.article = art
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({ fileSource: file });
      this.saveImage()
    }
  }

  onSubmit(){
    this.apiService.createArticles(this.descriptedarticleForm.value).subscribe({
      next:(value:any) => {
          console.log(value)
      },
      error(err) {
          console.log(err)
      },
    })
  }

  generateDescription(data: any) {
    this.loading = true
    this.apiService.descript(data).subscribe({
      next: (value: any) => {
        this.descriptedarticleForm.patchValue({ 
          description: value.text,
          nom: data.nom,
          file: data.file,
          prix: data.prix,
          category: this.catId(data.category),
        });
        this.loading = false
      },
      error:(err) =>{
        this.loading = false
      },
    })
  }

  catId(category:string){
    return this.categories.filter((cat:any)=>cat.nom == category)[0].id
  }

  saveImage() {
    const formData = new FormData();
    formData.append('file', this.myForm.value.fileSource!);
    this.apiService.uploadFile(formData).subscribe(
      {
        next: (value: any) => {
          this.articleForm.patchValue({ file: `http://localhost:3000/articles/image/${value.file.filename}` });
          this.generateDescription(this.articleForm.value)
        },
        error(err) {
          console.log(err)
        },
      }
    )
  }
}
