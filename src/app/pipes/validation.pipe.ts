import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	UnprocessableEntityException,
} from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
	constructor(private readonly validatorOptions?: ValidatorOptions) {}

	async transform(value: any, metadata: ArgumentMetadata) {
		if (
			!metadata?.metatype ||
			metadata.type === 'custom' ||
			!this.toValidate(metadata?.metatype)
		) {
			return value;
		}
		const object = plainToClass(metadata.metatype, value);
		const errors = await validate(object, this.validatorOptions);
		if (errors.length > 0) {
			throw new UnprocessableEntityException({
				errors: this.formatErrors(errors),
			});
		}
		return { ...object };
	}

	private toValidate(metatype: Function): boolean {
		const types: Function[] = [String, Boolean, Number, Array, Object];
		return !types.includes(metatype);
	}

	private formatErrors(errors: ValidationError[]) {
		return errors.reduce((acc, err) => {
			acc[err.property] = Object.values(err.constraints);
			return acc;
		}, {});
	}
}
