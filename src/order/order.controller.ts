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
  Logger,
  BadRequestException,
  Res,
} from '@nestjs/common';
// import { WebSocketGatewayService } from '../websocket.gateway'; // Import WebSocketGatewayService
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express'; // Pastikan impor dari 'express'
import { Order } from './order.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';
import { AppGateway } from '../app.gateway';
import { join } from 'path';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly appGateway: AppGateway, // Inject AppGateway

    // private readonly webSocketGatewayService: WebSocketGatewayService, // Add WebSocketGatewayService to constructor
  ) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({
    status: 201,
    description: 'The order item has been successfully created.',
    type: Order,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The order to create',
    type: CreateOrderDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        noMeja: { type: 'number', example: 1 },
        namaPelanggan: { type: 'string', example: 'John Doe' },
        statusPesanan: { type: 'string', example: 'Pending' },
        jenisPembayaran: { type: 'string', example: 'Cash' },
        orderan: {
          type: 'array',
          items: { $ref: '../order/dto/create-detail-orderan.dto.ts' },
        },
        totalHarga: { type: 'number', example: 100000 },
        gambarTransaksi: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('gambarTransaksi'))
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFile() gambarTransaksi: Express.Multer.File,
  ): Promise<Order> {
    // Parse orderan if it is a string
    if (typeof createOrderDto.orderan === 'string') {
      try {
        createOrderDto.orderan = JSON.parse(createOrderDto.orderan);
      } catch (error) {
        throw new BadRequestException('Invalid orderan format');
      }
    }

    // Ensure orderan is an array
    if (!Array.isArray(createOrderDto.orderan)) {
      throw new BadRequestException('orderan must be an array');
    }

    const order = await this.orderService.create(
      createOrderDto,
      gambarTransaksi,
    );
    this.appGateway.sendOrderNotification(order);
    return order;
  }

  @Get('images/:gambarTransaksi')
  getImage(
    @Param('gambarTransaksi') gambarTransaksi: string,
    @Res() res: Response,
  ) {
    const imagePath = join(
      __dirname,
      '..',
      '..',
      'file-transaksi',
      gambarTransaksi,
    );
    return res.sendFile(imagePath);
  }

  @Get()
  findAll() {
    return this.orderService.findAllOrder();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully fetched.',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOrderById(id);
  }
}