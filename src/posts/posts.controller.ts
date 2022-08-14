import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ListBasicOperationPost,
  ListQueryParamsPostDTO,
} from './dto/get-post.dto';
import { UpdateStatus } from './dto/update-status.dto';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { RolesGuard } from 'auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'homeImage', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; homeImage?: Express.Multer.File[] },
    @Body() createPostDto,
    @AuthPayload() authPayload: IAuthPayload,
  ) {
    const set: CreatePostDto = {
      ...createPostDto,
      image: files.image?.[0],
      homeImage: files.homeImage?.[0],
    };
    return this.postsService.create(set, authPayload);
  }

  @Post('/read/:slug')
  incrementReders(@Query('slug') slug: string) {
    return this.postsService.incrementReders(slug);
  }

  @Get('/all')
  findAllNoExclude(@Query() q: ListQueryParamsPostDTO) {
    const queryString: ListBasicOperationPost =
      this.postsService.parseQueryString(q);
    return this.postsService.findAllNoExclude(queryString);
  }

  @Get('/')
  findAll(@Query() q: ListQueryParamsPostDTO) {
    const queryString: ListBasicOperationPost =
      this.postsService.parseQueryString(q);
    return this.postsService.findAll(queryString);
  }

  @Get('/category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.postsService.findByCategoryId(categoryId);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @Patch(':slug')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'homeImage', maxCount: 1 },
    ]),
  )
  update(
    @Param('slug') slug: string,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; homeImage?: Express.Multer.File[] },
    @Body() updatePostDto: UpdatePostDto,
    @AuthPayload() authPayload: IAuthPayload,
  ) {
    const set: UpdatePostDto = {
      ...updatePostDto,
      image: files.image?.[0],
      homeImage: files.homeImage?.[0],
    };
    return this.postsService.update(slug, set, authPayload);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body() updateStatus: UpdateStatus) {
    return this.postsService.updateStatus(id, updateStatus);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
