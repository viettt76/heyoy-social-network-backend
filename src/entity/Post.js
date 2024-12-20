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
exports.Post = void 0;
const typeorm_1 = require("typeorm");
const PostVisibility_1 = require("./PostVisibility");
const PictureOfPost_1 = require("./PictureOfPost");
const EmotionPost_1 = require("./EmotionPost");
const Base_1 = require("./Base");
let Post = class Post extends Base_1.Base {
};
exports.Post = Post;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Post.prototype, "poster", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Post.prototype, "visibilityTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PostVisibility_1.PostVisibility),
    (0, typeorm_1.JoinColumn)({ name: 'visibilityTypeId', referencedColumnName: 'id' }),
    __metadata("design:type", PostVisibility_1.PostVisibility)
], Post.prototype, "visibility", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PictureOfPost_1.PictureOfPost, (picture) => picture.postId, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Post.prototype, "pictures", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EmotionPost_1.EmotionPost, (emotion) => emotion.postId, { cascade: true }),
    __metadata("design:type", Array)
], Post.prototype, "emotions", void 0);
exports.Post = Post = __decorate([
    (0, typeorm_1.Entity)({ name: 'post' })
], Post);
