-- SR-002: Aadhaar number must be unique
-- Clean up any duplicates before adding the constraint (keeping the most recently created one)
DELETE FROM seller_documents a USING (
    SELECT MIN(ctid) as ctid, document_number 
    FROM seller_documents 
    WHERE document_type = 'aadhaar' 
    GROUP BY document_number HAVING COUNT(*) > 1
) b WHERE a.document_number = b.document_number 
AND a.ctid <> b.ctid 
AND a.document_type = 'aadhaar';

-- We create a unique index on seller_documents for document_type = 'aadhaar'
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_aadhaar ON seller_documents(document_number) WHERE document_type = 'aadhaar';

-- SR-005: Seller username, once approved, cannot be changed
CREATE OR REPLACE FUNCTION check_username_immutable() RETURNS TRIGGER AS $$
BEGIN
  -- If the seller is already approved and the username is being changed, block it
  IF OLD.kyc_status = 'approved' AND NEW.username != OLD.username THEN
    RAISE EXCEPTION 'Seller username cannot be changed after approval (SR-005)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_check_username_immutable ON sellers;
CREATE TRIGGER tr_check_username_immutable
  BEFORE UPDATE ON sellers
  FOR EACH ROW
  EXECUTE FUNCTION check_username_immutable();

-- SR-006: Seller ID is system-generated and immutable
CREATE OR REPLACE FUNCTION check_seller_id_immutable() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.seller_id != OLD.seller_id THEN
    RAISE EXCEPTION 'Seller ID is immutable (SR-006)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_check_seller_id_immutable ON sellers;
CREATE TRIGGER tr_check_seller_id_immutable
  BEFORE UPDATE ON sellers
  FOR EACH ROW
  EXECUTE FUNCTION check_seller_id_immutable();
