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
exports.FriendRequest = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Base_1 = require("./Base");
let FriendRequest = class FriendRequest extends Base_1.Base {
};
exports.FriendRequest = FriendRequest;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], FriendRequest.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], FriendRequest.prototype, "receiverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.friendRequestAsSender, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'senderId', referencedColumnName: 'id' }),
    __metadata("design:type", User_1.User)
], FriendRequest.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.friendRequestAsReceiver, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'receiverId', referencedColumnName: 'id' }),
    __metadata("design:type", User_1.User)
], FriendRequest.prototype, "receiver", void 0);
exports.FriendRequest = FriendRequest = __decorate([
    (0, typeorm_1.Entity)({ name: 'friend_request' }),
    (0, typeorm_1.Unique)(['senderId', 'receiverId'])
], FriendRequest);
