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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ListBasicOperationPost,
  ListQueryParamsPostDTO,
} from './dto/get-post.dto';
import { UpdateStatus } from './dto/update-status.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() image: Express.Multer.File, @Body() createPostDto) {
    const set: CreatePostDto = {
      ...createPostDto,
      image,
    };
    return this.postsService.create(set);
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
  update(
    @Param('slug') slug: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const set: UpdatePostDto = {
      ...updatePostDto,
      image,
    };
    return this.postsService.update(slug, set);
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
