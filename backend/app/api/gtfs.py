import logging

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.gtfs_import_service import run_import, save_upload, validate_zip

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/import")
async def import_gtfs_zip(
    file: UploadFile = File(...),
    clear: bool = True,
):
    try:
        validate_zip(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    saved_path = save_upload(file)

    try:
        result = run_import(str(saved_path), clear=clear)
    except Exception as e:
        logger.exception("GTFS import failed")
        raise HTTPException(status_code=500, detail=f"Error durante la importación: {str(e)}")

    return {
        "status": "success",
        "message": "GTFS importado correctamente",
        "filename": file.filename,
        "clear": clear,
        "required_files_found": result.get("required_files_found", []),
        "optional_files_found": result.get("optional_files_found", []),
        "rows_per_table": result.get("rows_per_table", {}),
    }
