// backend/main.ts
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaClient} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'secret'; // use env in real app

// Guards (simplified)
function AuthGuard(req: { headers: { authorization: any; }; }) {
  const auth = req.headers.authorization;
  if (!auth) throw new Error('Unauthorized');
  const token = auth.replace('Bearer ', '');
  return jwt.verify(token, JWT_SECRET);
}

// DTO types
type SignupDto = { name: string; email: string; password: string; address?: string };
type LoginDto = { email: string; password: string };

// Controllers
@Controller('auth')
class AuthController {
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return prisma.user.create({ data: { ...dto, passwordHash } });
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new Error('Bad credentials');
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user.id, name: user.name, role: user.role } };
  }
}

@Controller('stores')
class StoreController {
  @Get()
  async list() {
    return prisma.store.findMany();
  }

  @Post(':id/rating')
  async rate(@Req() req: any, @Body() body: { rating: number }) {
    const user = AuthGuard(req);
    const storeId = Number(req.params.id);
    let userId: number;
    if (typeof user.sub === 'string') {
      userId = Number(user.sub);
    } else if (typeof user.sub === 'number') {
      userId = user.sub;
    } else {
      throw new Error('Invalid user id');
    }
    await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { value: body.rating },
      create: { userId, storeId, value: body.rating },
    });
    return { ok: true };
  }
}

@Module({ controllers: [AuthController, StoreController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
