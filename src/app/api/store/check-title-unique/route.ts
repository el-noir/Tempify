import dbConnect from '@/lib/connection/dbConnect'
import StoreModel from '@/model/Store'
import { z } from 'zod'
import { titleValidation } from '@/lib/validations'
import { NextResponse } from 'next/server'

const titleQuerySchema = z.object({
  name: titleValidation,
})

export async function GET(req: Request) {
  await dbConnect()
  try {
    const { searchParams } = new URL(req.url)
    const queryParam = {
      name: searchParams.get('name'),
    }

    const result = titleQuerySchema.safeParse(queryParam)

    if (!result.success) {
      const titleErrors = result.error.format().name?._errors || []
      return NextResponse.json(
        {
          success: false,
          message: titleErrors.length > 0 ? titleErrors.join(', ') : 'Invalid query parameters',
        },
        { status: 400 }
      )
    }

    const { name } = result.data

    const nameExist = await StoreModel.findOne({ name })

    if (nameExist) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name already exists',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Name is unique',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking name:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error checking name',
      },
      { status: 500 }
    )
  }
}