from functools import wraps
import inspect
from fastapi.responses import JSONResponse
from src.utils.responses import standard_response

def requires_role(role: str):
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            user_credentials = kwargs.get("user_credentials")
            if not user_credentials or user_credentials.get("role") != role:
                return JSONResponse(
                    content=standard_response(
                        success=False,
                        message=f"Se requiere el rol {role} para acceder a esta funcionalidad.",
                    ),
                    status_code=403,
                )
            
            if inspect.iscoroutinefunction(func):
                return await func(*args, **kwargs)
            return func(*args, **kwargs)

        return async_wrapper
    return decorator
