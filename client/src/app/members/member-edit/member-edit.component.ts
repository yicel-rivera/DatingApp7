import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member = {} as Member;
  user?: User;

  constructor(public memberService: MembersService,
    private toastr: ToastrService, private route: ActivatedRoute) {
    //   this.accountService.currentUser$.pipe(take(1)).subscribe ({
    //     next: user => {
    //       if (user) this.user = user;
    //     }
    //   })
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })
  }

  // loadMember() {
  //   if (this.user) {
  //     this.memberService.getMember(this.user.userName).subscribe({
  //       next: member => this.member = member
  //     })
  //   }
  // }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success("Profile updated successfully")
        this.editForm?.reset(this.member);
      }
    })
  }

}
