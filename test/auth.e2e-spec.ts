import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
   let app: INestApplication;

   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
   });

   it('handles a sign up request', () => {
      const bodyEmail = 'asdfg1@gmail.com';
      return request(app.getHttpServer())
         .post('/users/signup')
         .send({
            name: 'Carlos',
            lastName: 'Sanchez',
            age: 20,
            address: 'Pinto 678',
            email: bodyEmail,
            password: 'hola882'
         })
         .expect(201)
         .then((res) => {
            const { id, email } = res.body;
            expect(id).toBeDefined();
            expect(email).toEqual(bodyEmail);
         })
   });

   it('signup as a new user then get the currently logged in user', async () => {
      const bodyEmail = 'asdfg2@gmail.com';
      const res = await request(app.getHttpServer())
         .post('/users/signup')
         .send({
            name: 'Carlos',
            lastName: 'Sanchez',
            age: 20,
            address: 'Pinto 678',
            email: bodyEmail,
            password: 'hola882'
         })
         .expect(201)

      const cookie = res.get('Set-Cookie');

      const { body } = await request(app.getHttpServer())
         .get('/users/whoami')
         .set('Cookie', cookie)
         .expect(200);

      expect(body.email).toEqual(bodyEmail);
   })
});