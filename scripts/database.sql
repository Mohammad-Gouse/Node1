-- ALTER TABLE user_log RENAME TO users_log;
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- create function last_updated() returns trigger
--   language plpgsql
-- as
-- $$
-- BEGIN
--     NEW.updated_at = now() AT TIME ZONE 'UTC';
--     RETURN NEW;
-- END
-- $$;
-- create function texple_audit() returns trigger
--   language plpgsql
-- as
-- $$
-- DECLARE
--     BEGIN
--         IF (TG_OP = 'UPDATE') THEN
--             EXECUTE format('INSERT INTO %I.%I SELECT $1,''U'',now() AT TIME ZONE ''UTC'' , $2.*'
--                 , TG_TABLE_SCHEMA, TG_TABLE_NAME || '_log')
--             USING nextval(TG_ARGV[0] :: regclass),  NEW;
--         ELSIF (TG_OP = 'INSERT') THEN
--             EXECUTE format('INSERT INTO %I.%I SELECT $1,''I'',now() AT TIME ZONE ''UTC'' , $2.*'
--                 , TG_TABLE_SCHEMA, TG_TABLE_NAME || '_log')
--             USING nextval(TG_ARGV[0] :: regclass),  NEW;
--         ELSEIF (TG_OP = 'DELETE') THEN
--             EXECUTE format('INSERT INTO %I.%I SELECT $1,''D'',now() AT TIME ZONE ''UTC'' , $2.*'
--                 , TG_TABLE_SCHEMA, TG_TABLE_NAME || '_log')
--             USING nextval(TG_ARGV[0] :: regclass),  OLD;
--         END IF;
--         RETURN NULL; -- result is ignored since this is an AFTER trigger
--     END;
-- $$;
-- CREATE SEQUENCE user_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     email character varying not null UNIQUE,
--     password character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE user_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE users_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     email character varying not null UNIQUE,
--     password character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE PROCEDURE texple_audit('user_log_id_seq');
-- -- shape table
-- CREATE SEQUENCE shape_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS shapes;
-- CREATE TABLE shapes (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     name character varying NOT NULL UNIQUE,
--     tag character varying NOT NULL,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE shape_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE shapes_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     name character varying not null,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON shapes FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON shapes FOR EACH ROW EXECUTE PROCEDURE texple_audit('shape_log_id_seq');
-- -- size table
-- CREATE SEQUENCE size_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS sizes;
-- CREATE TABLE sizes (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     carat double precision NOT NULL,
--     tag character varying NOT NULL,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE size_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE sizes_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     carat double precision NOT NULL,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON sizes FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON sizes FOR EACH ROW EXECUTE PROCEDURE texple_audit('size_log_id_seq');
-- -- clarity table
-- CREATE SEQUENCE clarity_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS claritys;
-- CREATE TABLE claritys (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     name character varying NOT NULL UNIQUE,
--     tag character varying NOT NULL,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE clarity_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE claritys_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     name character varying not null,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON claritys FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON claritys FOR EACH ROW EXECUTE PROCEDURE texple_audit('clarity_log_id_seq');
-- -- colour
-- CREATE SEQUENCE colour_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS colours;
-- CREATE TABLE colours (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     name character varying not null,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE colour_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE colours_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     name character varying not null,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON colours FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON colours FOR EACH ROW EXECUTE PROCEDURE texple_audit('colour_log_id_seq');
-- -- currency master
-- CREATE SEQUENCE currency_master_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS currency_master;
-- CREATE TABLE currency_master (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     name character varying not null,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE currency_master_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE currency_master_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     name character varying not null,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON currency_master FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON currency_master FOR EACH ROW EXECUTE PROCEDURE texple_audit('currency_master_log_id_seq');
-- -- currency rate
-- CREATE SEQUENCE currency_rate_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS currency_rate;
-- CREATE TABLE currency_rate (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     currency_1 character varying not null,
--     currency_2 character varying not null,
--     tag character varying not null ,
--     price double precision not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE currency_rate_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE currency_rate_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     currency_1 character varying not null,
--     currency_2 character varying not null,
--     tag character varying not null ,
--     price double precision not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON currency_rate FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON currency_rate FOR EACH ROW EXECUTE PROCEDURE texple_audit('currency_rate_log_id_seq');
-- -- underlying asset
-- CREATE SEQUENCE underlying_asset_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS underlying_asset;
-- CREATE TABLE underlying_asset (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     name character varying not null,
--     description character varying not null,
--     tag character varying not null ,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE underlying_asset_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE underlying_asset_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     name character varying not null,
--     description character varying not null,
--     tag character varying not null ,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON underlying_asset FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON underlying_asset FOR EACH ROW EXECUTE PROCEDURE texple_audit('underlying_asset_log_id_seq');
-- -- product master 
-- CREATE SEQUENCE product_master_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS product_master;
-- CREATE TABLE product_master (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     underlying_id uuid REFERENCES underlying_asset(id),
--     shape uuid REFERENCES shapes(id),
--     size uuid REFERENCES sizes(id),
--     clarity uuid REFERENCES claritys(id),
--     colour uuid REFERENCES colours(id),
-- 	price integer not null,
-- 	corelation_factor double precision not null,
--     tag character varying,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE product_master_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE product_master_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     underlying_id uuid REFERENCES underlying_asset(id),
--     shape uuid REFERENCES shape(id),
--     size uuid REFERENCES size(id),
--     clarity uuid REFERENCES clarity(id),
--     colour uuid REFERENCES colour(id),
--     tag character varying not null ,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON product_master FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON product_master FOR EACH ROW EXECUTE PROCEDURE texple_audit('product_master_log_id_seq');
-- -- user price 
-- CREATE SEQUENCE user_price_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS user_price;
-- CREATE TABLE user_price (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     user_id uuid REFERENCES users(id),
--     product_id uuid REFERENCES product_master(id),
--     price double precision,
--     remark character varying,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE user_price_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE user_price_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     user_id uuid REFERENCES users(id),
--     product_id uuid REFERENCES product_master(id),
--     price double precision,
--     remark character varying,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON user_price FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON user_price FOR EACH ROW EXECUTE PROCEDURE texple_audit('user_price_log_id_seq');
-- -- dcx price 
-- CREATE SEQUENCE dcx_price_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS dcx_price;
-- CREATE TABLE dcx_price (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
--     product_id uuid REFERENCES product_master(id),
--     price double precision,
--     calculation_type character varying,
--     calculation_value double precision,
--     price_type boolean default true,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE dcx_price_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE dcx_price_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     product_id uuid REFERENCES product_master(id),
--     price double precision,
--     calculation_type character varying,
--     calculation_value double precision,
--     price_type boolean default true,
--     tag character varying not null,
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON dcx_price FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON dcx_price FOR EACH ROW EXECUTE PROCEDURE texple_audit('dcx_price_log_id_seq');
-- -- configuration
-- CREATE SEQUENCE configurations_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- DROP TABLE IF EXISTS configurations;
-- CREATE TABLE configurations (
--     id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
-- 	percentage double precision,
-- 	percentage_status  boolean default true,
-- 	count double precision,
-- 	count_status  boolean default false,
-- 	days_count bigint,
-- 	days_type character varying,
-- 	threshold_value bigint, 
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE SEQUENCE configurations_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
-- CREATE TABLE configurations_log (
--     log_id BIGINT PRIMARY KEY,
--     dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
--     log_timestamp timestamptz,
--     id uuid NOT NULL,
--     percentage double precision,
-- 	percentage_status  boolean default true,
-- 	count double precision,
-- 	count_status boolean default false,
-- 	days_count bigint,
-- 	days_type character varying,
-- 	threshold_value bigint, 
--     is_active boolean default true,
--     created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     created_by character varying default 1,
--     updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
--     updated_by character varying default 1
-- );
-- CREATE TRIGGER last_updated BEFORE UPDATE ON configurations FOR EACH ROW EXECUTE PROCEDURE last_updated();
-- CREATE TRIGGER texple_audit AFTER INSERT OR UPDATE OR DELETE ON configurations FOR EACH ROW EXECUTE PROCEDURE texple_audit('configurations_log_id_seq');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create function last_updated() returns trigger language plpgsql as $$ BEGIN NEW.updated_at = now() AT TIME ZONE 'UTC';

RETURN NEW;

END $$;

create function texple_audit() returns trigger language plpgsql as $$ DECLARE BEGIN IF (TG_OP = 'UPDATE') THEN EXECUTE format(
    'INSERT INTO %I.%I SELECT $1,''U'',now() AT TIME ZONE ''UTC'' , $2.*',
    TG_TABLE_SCHEMA,
    TG_TABLE_NAME || '_log'
) USING nextval(TG_ARGV [0] :: regclass),
NEW;

ELSIF (TG_OP = 'INSERT') THEN EXECUTE format(
    'INSERT INTO %I.%I SELECT $1,''I'',now() AT TIME ZONE ''UTC'' , $2.*',
    TG_TABLE_SCHEMA,
    TG_TABLE_NAME || '_log'
) USING nextval(TG_ARGV [0] :: regclass),
NEW;

ELSEIF (TG_OP = 'DELETE') THEN EXECUTE format(
    'INSERT INTO %I.%I SELECT $1,''D'',now() AT TIME ZONE ''UTC'' , $2.*',
    TG_TABLE_SCHEMA,
    TG_TABLE_NAME || '_log'
) USING nextval(TG_ARGV [0] :: regclass),
OLD;

END IF;

RETURN NULL;

-- result is ignored since this is an AFTER trigger
END;

$$;

CREATE SEQUENCE user_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    email character varying not null UNIQUE,
    password character varying not null,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE user_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE users_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    email character varying not null UNIQUE,
    password character varying not null,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON users FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON users FOR EACH ROW EXECUTE PROCEDURE texple_audit('user_log_id_seq');

drop table if exists rbac_roles;

CREATE TABLE rbac_roles (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

drop table if exists user_role_mapping;

CREATE TABLE user_role_mapping (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users (id),
    role_id uuid NOT NULL REFERENCES rbac_roles (id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);


CREATE SEQUENCE shape_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS shapes;

CREATE TABLE shapes (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name character varying NOT NULL UNIQUE,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE shape_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE shapes_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    name character varying not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON shapes FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON shapes FOR EACH ROW EXECUTE PROCEDURE texple_audit('shape_log_id_seq');

-- size table
CREATE SEQUENCE size_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS sizes;

CREATE TABLE sizes (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    carat double precision NOT NULL,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE size_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE sizes_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    carat double precision NOT NULL,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON sizes FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON sizes FOR EACH ROW EXECUTE PROCEDURE texple_audit('size_log_id_seq');

-- clarity table
CREATE SEQUENCE clarity_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS claritys;

CREATE TABLE claritys (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name character varying NOT NULL UNIQUE,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE clarity_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE claritys_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    name character varying not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON claritys FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON claritys FOR EACH ROW EXECUTE PROCEDURE texple_audit('clarity_log_id_seq');

-- colour
CREATE SEQUENCE colour_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS colours;

CREATE TABLE colours (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name character varying not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE colour_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE colours_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    name character varying not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON colours FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON colours FOR EACH ROW EXECUTE PROCEDURE texple_audit('colour_log_id_seq');

-- currency master
CREATE SEQUENCE currency_master_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS currency_master;

CREATE TABLE currency_master (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name character varying not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE currency_master_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE currency_master_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    name character varying not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON currency_master FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON currency_master FOR EACH ROW EXECUTE PROCEDURE texple_audit('currency_master_log_id_seq');

-- currency rate
CREATE SEQUENCE currency_rate_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS currency_rate;

CREATE TABLE currency_rate (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    currency_1 character varying not null,
    currency_2 character varying not null,
    tag character varying,
    price double precision not null,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE currency_rate_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE currency_rate_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    currency_1 character varying not null,
    currency_2 character varying not null,
    tag character varying,
    price double precision not null,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON currency_rate FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON currency_rate FOR EACH ROW EXECUTE PROCEDURE texple_audit('currency_rate_log_id_seq');

-- underlying asset
CREATE SEQUENCE underlying_asset_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS underlying_asset;

CREATE TABLE underlying_asset (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name character varying not null,
    description character varying not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE underlying_asset_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE underlying_asset_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    name character varying not null,
    description character varying not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON underlying_asset FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON underlying_asset FOR EACH ROW EXECUTE PROCEDURE texple_audit('underlying_asset_log_id_seq');

-- product master 
CREATE SEQUENCE product_master_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS product_master;

CREATE TABLE product_master (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    underlying_id uuid REFERENCES underlying_asset(id),
    shape uuid REFERENCES shapes(id),
    size uuid REFERENCES sizes(id),
    clarity uuid REFERENCES claritys(id),
    colour uuid REFERENCES colours(id),
    price integer not null,
    corelation_factor double precision not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE product_master_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE product_master_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    underlying_id uuid REFERENCES underlying_asset(id),
    shape uuid REFERENCES shapes(id),
    size uuid REFERENCES sizes(id),
    clarity uuid REFERENCES claritys(id),
    colour uuid REFERENCES colours(id),
    price integer not null,
    corelation_factor double precision not null,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON product_master FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON product_master FOR EACH ROW EXECUTE PROCEDURE texple_audit('product_master_log_id_seq');

-- user price 
CREATE SEQUENCE user_price_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS user_price;

CREATE TABLE user_price (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES users(id),
    product_id uuid REFERENCES product_master(id),
    price double precision,
    remark character varying,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE user_price_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE user_price_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    user_id uuid REFERENCES users(id),
    product_id uuid REFERENCES product_master(id),
    price double precision,
    remark character varying,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON user_price FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON user_price FOR EACH ROW EXECUTE PROCEDURE texple_audit('user_price_log_id_seq');

-- dcx price 
CREATE SEQUENCE dcx_price_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS dcx_price;

CREATE TABLE dcx_price (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id uuid REFERENCES product_master(id),
    price double precision,
    calculation_type character varying,
    calculation_value double precision,
    price_type boolean default true,
    price_model character varying,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE dcx_price_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE dcx_price_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    product_id uuid REFERENCES product_master(id),
    price double precision,
    calculation_type character varying,
    calculation_value double precision,
    price_type boolean default true,
    price_model character varying,
    tag character varying,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON dcx_price FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON dcx_price FOR EACH ROW EXECUTE PROCEDURE texple_audit('dcx_price_log_id_seq');

-- configuration
CREATE SEQUENCE configurations_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

DROP TABLE IF EXISTS configurations;

CREATE TABLE configurations (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    percentage double precision,
    percentage_status boolean default true,
    count double precision,
    count_status boolean default false,
    days_count bigint,
    days_type character varying,
    threshold_value bigint,
    random_pecentage bigint,
    round_off_digit bigint,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE SEQUENCE configurations_log_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE configurations_log (
    log_id BIGINT PRIMARY KEY,
    dml_action char(1) NOT NULL CHECK (dml_action IN ('I', 'D', 'U')),
    log_timestamp timestamptz,
    id uuid NOT NULL,
    percentage double precision,
    percentage_status boolean default true,
    count double precision,
    count_status boolean default false,
    days_count bigint,
    days_type character varying,
    threshold_value bigint,
    random_pecentage bigint,
    round_off_digit bigint,
    is_active boolean default true,
    created_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by character varying default 1,
    updated_at timestamptz DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_by character varying default 1
);

CREATE TRIGGER last_updated BEFORE
UPDATE
    ON configurations FOR EACH ROW EXECUTE PROCEDURE last_updated();

CREATE TRIGGER texple_audit
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON configurations FOR EACH ROW EXECUTE PROCEDURE texple_audit('configurations_log_id_seq');