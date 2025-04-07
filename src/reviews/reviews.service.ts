import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { HotelsService } from 'src/hotels/hotels.service';
import { UsersService } from 'src/users/users.service';
import { I18nContext } from 'nestjs-i18n';
import { JwtPayloadType } from 'src/utils/types';
import { UserType } from 'src/utils/enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
    private readonly hotelsService: HotelsService,
    private readonly usersService: UsersService
  ) { }

  /**
   * Create new review
   * @param hotelId id of the hotel
   * @param userId id of the user that created this review
   * @param dto data for creating new review
   * @returns the created review from the database
   */
  async create(productId: string, userId: string, dto: CreateReviewDto, i18n: I18nContext) {
    const hotel = await this.hotelsService.findById(productId, i18n);
    const user = await this.usersService.getCurrentUser(userId);

    const review = this.reviewsRepository.create({
      ...dto,
      user: { id: user.id },
      hotel: { id: hotel.data.id },
    });
    const result = await this.reviewsRepository.save(review);

    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      userId: user.id,
      hotelId: hotel.data.id,
    }
  }

  /**
      * Get all reviews
      * @returns collection of reviews
      */
  public async getAll() {
    return this.reviewsRepository.find();
  }
  /**
    * Get single review by id
    * @param id id of the review
    * @returns review from the database
    */
 private async findOne(id: string) {
    const review = await this.reviewsRepository.findOne({ where: { id: Number(id) } });
    if (!review) throw new NotFoundException("review not found");
    return review;
  }

  /**
 * Update reviews
 * @param reviewId id of the review 
 * @param userId id of the owner of the review
 * @param dto data for updating the review
 * @returns updated review
 */
  public async update(reviewId: string, userId:string, dto: UpdateReviewDto) {
    const review = await this.findOne(reviewId);
    if(review.user.id !== userId)
        throw new ForbiddenException("access denied, you are not allowed");
    
    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;
    
    return this.reviewsRepository.save(review);
}

  /**
     * Delete review
     * @param reviewId id of the review
     * @param payload JWTPayload
     * @returns a success message
     */
  public async delete(reviewId:string, payload: JwtPayloadType) {
    const review = await this.findOne(reviewId);

    if(review.user.id === payload.id || payload.role === UserType.ADMIN) {
        await this.reviewsRepository.remove(review);
        return { message: 'Review has been deleted' };
    }

    throw new ForbiddenException("you are not allowed");
}
}
