"""Fusionando migraciones

Revision ID: afff7de2af40
Revises: 5a17ac5efa47, c34ba3b90bf2
Create Date: 2025-02-12 19:20:51.619476

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'afff7de2af40'
down_revision: Union[str, None] = ('5a17ac5efa47', 'c34ba3b90bf2')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
