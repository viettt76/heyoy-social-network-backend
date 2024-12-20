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
exports.GroupMember = void 0;
const typeorm_1 = require("typeorm");
const GroupChat_1 = require("./GroupChat");
const User_1 = require("./User");
const Base_1 = require("./Base");
let GroupMember = class GroupMember extends Base_1.Base {
};
exports.GroupMember = GroupMember;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], GroupMember.prototype, "groupChatId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], GroupMember.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], GroupMember.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GroupChat_1.GroupChat),
    (0, typeorm_1.JoinColumn)({ name: 'groupChatId', referencedColumnName: 'id' }),
    __metadata("design:type", GroupChat_1.GroupChat)
], GroupMember.prototype, "groupChat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'memberId', referencedColumnName: 'id' }),
    __metadata("design:type", User_1.User)
], GroupMember.prototype, "user", void 0);
exports.GroupMember = GroupMember = __decorate([
    (0, typeorm_1.Entity)({ name: 'group_member' }),
    (0, typeorm_1.Unique)(['groupChatId', 'memberId'])
], GroupMember);
