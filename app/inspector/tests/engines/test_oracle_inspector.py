# -*- coding: utf-8 -*-
import unittest
import unittest.mock as mock

import app.inspector.engines.oracle_inspector as engine


class OracleInspectorTests(unittest.TestCase):
    """Tests to ensure that the engine follows the subscribed interface.
    """
    def setUp(self):
        """Get ready for some tests...
        """
        self.connection = {
            'host': 'localhost',
            'username': 'admin',
            'password': '1234567890',
            'port': 3306,
            'database': 'acme',
        }
        self.engine = engine.OracleInspector(**self.connection)

    def test_has_indexes_sql(self):
        """It should have `indexes_sql` attribute defined.
        """
        assert isinstance(engine.OracleInspector.indexes_sql, str)

    def test_get_tables_and_views_sql(self):
        """It should create the proper `tables_and_views_sql` where clause.
        """
        sch = ['one', 'two', 'three']
        sql = self.engine.get_tables_and_views_sql(sch)
        exc = '''
        WHERE LOWER(T.OBJECT_TYPE) IN ('table', 'view')
          AND LOWER(T.OWNER) NOT IN (:1, :2, :3)
          AND U.ORACLE_MAINTAINED = 'N'
        '''
        self.assertIn(
            ''.join(exc.split()).strip(),
            ''.join(sql.split()).strip(),
        )

    def test_get_indexes_sql(self):
        """It should create the proper `indexes_sql` where clause.
        """
        sch = ['one', 'two']
        sql = self.engine.get_indexes_sql(sch)
        exc = '''
        WHERE I.OBJECT_TYPE IN ('INDEX')
          AND LOWER(I.OWNER) NOT IN (:1, :2)
          AND U.ORACLE_MAINTAINED = 'N'
        '''
        self.assertIn(
            ''.join(exc.split()).strip(),
            ''.join(sql.split()).strip(),
        )

    def test_has_definitions_sql(self):
        """It should have `definitions_sql` attribute defined.
        """
        assert isinstance(engine.OracleInspector.definitions_sql, str)

    def test_assertion_query(self):
        """Snapshot check for the `assertion_query` attribute.
        """
        assert self.engine.assertion_query == (
            "SELECT 1 as assertion FROM DBA_OBJECTS WHERE ROWNUM = 1"
        )

    def test_sys_schemas(self):
        """It should have the expected system table schemas.
        """
        assert set(self.engine.sys_schemas) == {
            'rdsadmin',
        }

    def test_has_indexes(self):
        """It should have indexes.
        """
        assert engine.OracleInspector.has_indexes()

    @mock.patch.object(engine.OracleInspector, 'get_first', return_value={'banner': '9.6.0'})
    def test_get_db_version(self, get_first):
        """It should implement Oracle.get_db_version()
        """
        self.assertEqual(self.engine.get_db_version(), '9.6.0')

    @mock.patch.object(engine.OracleInspector, 'get_db_version', return_value='10.1.2')
    def test_version(self, get_db_version):
        """It should implement Oracle.version
        """
        self.assertEqual(self.engine.version, '10.1.2')
