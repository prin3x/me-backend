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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, fileFilter } from 'utils/fileUtils';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: editFileName,
      }),
      fileFilter: fileFilter,
    }),
  )
  create(@UploadedFile() image: Express.Multer.File, @Body() createPostDto) {
    const set: CreatePostDto = {
      ...createPostDto,
      image,
    };
    return this.postsService.create(set);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('/category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.postsService.findByCategoryId(categoryId);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(slug, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
