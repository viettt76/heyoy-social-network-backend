"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Base_1 = require("./Base");
const EmotionComment_1 = require("./EmotionComment");
let Comment = class Comment extends Base_1.Base {
};
exports.Comment = Comment;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Comment.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Comment.prototype, "commentator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Comment.prototype, "parentCommentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.comments),
    (0, typeorm_1.JoinColumn)({ name: 'commentator', referencedColumnName: 'id' }),
    __metadata("design:type", User_1.User)
], Comment.prototype, "commentatorInfo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EmotionComment_1.EmotionComment, (emotionComment) => emotionComment.commentId, { cascade: true }),
    __metadata("design:type", Array)
], Comment.prototype, "emotions", void 0);
exports.Comment = Comment = __decorate([
    (0, typeorm_1.Entity)({ name: 'comment' })
], Comment);
