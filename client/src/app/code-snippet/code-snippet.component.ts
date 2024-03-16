import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of, tap } from 'rxjs';
import { CodeSnippetResponseModel } from './models/code-snippet-response-model';
import { AnswerRequestModel } from './models/answer-request-model';
import { AnswerResponseModel } from './models/answer-response-model.interface';
import { NavbarService } from '../services/navbar.service';
import { environment } from '../../environments/environment.development';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrls: ['./code-snippet.component.scss'],
  standalone: true,
  imports: [
    HighlightModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TitleCasePipe,
  ],
})
export class CodeSnippetComponent implements OnInit {
  private url = '';
  public $codeSnippet = signal('');
  public $isLoading = signal(false);
  public answerInput = '';
  public languages = [
    'javascript',
    'typescript',
    'python',
    'java',
    'go',
    'c',
    'c#',
    'c++',
    'php',
    'ruby',
    'rust',
  ];
  public levels = ['1', '2', '3'];
  public streak = 0;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public navbarService: NavbarService,
  ) {
    this.url = environment.url;
  }

  ngOnInit() {
    this.getCodeSnippet();
  }

  public selectLanguage(event: MatSelectChange): void {
    this.navbarService.selectLanguage(event.value);
  }

  public selectLevel(event: MatSelectChange): void {
    this.navbarService.selectLevel(event.value);
  }

  public getCodeSnippet(): void {
    this.$isLoading.set(true);
    this.answerInput = '';

    const params = new HttpParams()
      .append('language', this.navbarService.selectedLanguage())
      .append('level', this.navbarService.selectedLvl());

    this.http
      .get<CodeSnippetResponseModel>(`${this.url}/code-snippet`, { params })
      .pipe(
        tap((res) => {
          this.$codeSnippet.set(res.code);
        }),
        finalize(() => this.$isLoading.set(false)),
        catchError((err) => {
          this.toastr.error('Something went wrong! Please try again.');
          return err;
        }),
      )
      .subscribe();
  }

  public checkAnswer(form: NgForm): void {
    if (form.invalid) {
      this.toastr.warning('Please type your answer');
      return;
    }
    this.$isLoading.set(true);

    const answer: AnswerRequestModel = {
      code: this.$codeSnippet(),
      output: form.value.answer,
    };

    this.http
      .post<AnswerResponseModel>(`${this.url}/code-snippet`, { answer })
      .pipe(
        tap((res) => {
          this.$isLoading.set(false);
          if (res.wrong) {
            this.streak = 0;
            this.toastr.error(res.wrong);
            return;
          }
          if (res.correct) {
            this.streak++;

            this.streak % 3 === 0
              ? this.toastr.success(
                  `You're doing a great job! Consider going to the next level.`,
                )
              : this.toastr.success(res.correct);

            this.getCodeSnippet();
            return;
          }
          this.toastr.error('Something went wrong! Please try again');
        }),
        catchError((err) => {
          this.toastr.error('Something went wrong! Please try again.');
          return of(err);
        }),
      )
      .subscribe();
  }
}
