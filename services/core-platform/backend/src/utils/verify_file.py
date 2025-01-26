from fastapi import HTTPException, UploadFile


async def validate_file(file: UploadFile, allowed_types: list, max_size: int):
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"El archivo {file.filename} tiene un tipo no permitido ({file.content_type}).",
        )
    content = await file.read()
    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"El archivo {file.filename} supera el tamaño máximo de {max_size // (1024 * 1024)} MB.",
        )
    await file.seek(0)
    