import { BadRequestException } from '@nestjs/common';

export const checkValidId = (id: string) => {
  if (isNaN(parseInt(id))) {
    throw new BadRequestException('Invalid user id');
  }

  return true;
}

module.exports = { checkValidId };
