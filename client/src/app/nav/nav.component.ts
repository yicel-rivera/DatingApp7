import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  member: Member | undefined;
  user: User | null = null;
  userParams: UserParams | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;

  constructor(public accountService: AccountService, private route: Router,
    private memberService: MembersService) {
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    });
    
    if (this.user) {
      this.memberService.getMember(this.user.username).subscribe({
        next: member => this.member = member
      })
    }
    
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    }
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.route.navigateByUrl('/members');
        this.loadMember();
    }
    }
    )
  }

  logout() {
    this.accountService.logout();
    this.route.navigateByUrl('/');
  }
}
