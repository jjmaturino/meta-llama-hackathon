from app.db import source_material_db
from app.pydantic_models.source_mat import SourceMaterial
from app.db.id_generators import generate_source_material_id
from typing import Optional, List


#--- CRUD Operations for Source Material ---
def create_source_material(source_material: SourceMaterial) -> SourceMaterial:
    if source_material.id == 0 or source_material.id is None:
        source_material.id = generate_source_material_id()
    source_material_db[source_material.id] = source_material
    return source_material

def get_source_material(id: int) -> Optional[SourceMaterial]:
    return source_material_db.get(id)

def get_all_source_material() -> List[str]:
    return list(source_material_db.values())
