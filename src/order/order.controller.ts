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
import { Order } from './order.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';
import { AppGateway } from 'src/app.gateway';

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
      createOrderDto.orderan = JSON.parse(createOrderDto.orderan);
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

  @Get()
  findAll() {
    return this.orderService.findAllOrder();
  }
}
