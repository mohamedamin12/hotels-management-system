import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiSecurity } from '@nestjs/swagger';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enum';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JwtPayloadType } from 'src/utils/types';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('api/v1/reviews')
@ApiSecurity('bearer')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }


  //* POST: ~/api/v1/reviews/:hotelId
  @Post(':hotelId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.User)
  public createNewReview(
    @Param('hotelId') hotelId: string,
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JwtPayloadType,
    @I18n() i18n: I18nContext,
  ) {
    return this.reviewsService.create(hotelId, payload.id, body, i18n);
  }
  //* GET: ~/api/v1/reviews
  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public getAllReviews(
  ) {
    return this.reviewsService.getAll();
  }

  //* PUT: ~/api/v1/reviews/:id
  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.User)
  public updateReview(
    @Param('id') id: string,
    @Body() body: UpdateReviewDto,
    @CurrentUser() payload: JwtPayloadType
  ) {
    return this.reviewsService.update(id, payload.id, body);
  }

  //* DELETE: ~/api/v1/reviews/:id
  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.User)
  public deleteReview(@Param('id') id: string, @CurrentUser() payload: JwtPayloadType) {
    return this.reviewsService.delete(id, payload);
  }
}
