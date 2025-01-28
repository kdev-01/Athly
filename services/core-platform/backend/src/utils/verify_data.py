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
    
def validate_identification(identification: str):
    if len(identification) != 10:
        raise HTTPException(
            status_code=400, detail="La cédula debe tener exactamente 10 caracteres."
        )
    
    region_digit = int(identification[0:2])
    if 1 <= region_digit <= 24:
        last_digit = int(identification[9])
        even_sum = sum(int(identification[i]) for i in range(1, 9, 2))
        odd_sum = 0

        for i in range(0, 9, 2):
            num = int(identification[i]) * 2
            if num > 9:
                num -= 9
            odd_sum += num
        
        total_sum = even_sum + odd_sum
        next_ten = ((total_sum // 10) + 1) * 10
        verification_digit = next_ten - total_sum
        if verification_digit == 10:
            verification_digit = 0

        if verification_digit != last_digit:
            raise HTTPException(
                status_code=400,
                detail=f'La cédula {identification} es incorrecta'
            )
        
def validate_name(name: str):
    if len(name) < 3 or len(name) > 60:
        raise HTTPException(
            status_code=400,
            detail="Debe tener entre 3 y 60 caracteres.",
        )

