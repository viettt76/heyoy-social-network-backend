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
exports.EmotionComment = void 0;
const typeorm_1 = require("typeorm");
const EmotionType_1 = require("./EmotionType");
const User_1 = require("./User");
const Base_1 = require("./Base");
let EmotionComment = class EmotionComment extends Base_1.Base {
};
exports.EmotionComment = EmotionComment;
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], EmotionComment.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], EmotionComment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], EmotionComment.prototype, "emotionTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => EmotionType_1.EmotionType),
    (0, typeorm_1.JoinColumn)({ name: 'emotionTypeId', referencedColumnName: 'id' }),
    __metadata("design:type", EmotionType_1.EmotionType)
], EmotionComment.prototype, "emotion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId', referencedColumnName: 'id' }),
    __metadata("design:type", User_1.User)
], EmotionComment.prototype, "userInfo", void 0);
exports.EmotionComment = EmotionComment = __decorate([
    (0, typeorm_1.Entity)('emotion_comment'),
    (0, typeorm_1.Unique)(['commentId', 'userId'])
], EmotionComment);
